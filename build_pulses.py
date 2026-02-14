#!/usr/bin/env python3
"""
Build pulses.html from content_queue.json.
Reads pending items, generates HTML pulse cards, injects into pulses.html template,
and moves processed items to 'posted' array.
"""
import json
import os
import html
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
QUEUE_FILE = os.path.join(SCRIPT_DIR, "content_queue.json")
PULSES_FILE = os.path.join(SCRIPT_DIR, "pulses.html")

def format_date(iso_str):
    try:
        dt = datetime.fromisoformat(iso_str)
        return dt.strftime("%b %d, %Y • %I:%M %p")
    except:
        return iso_str

def escape(text):
    return html.escape(str(text))

def render_pulse(item):
    item_type = item.get("type", "update")
    date_str = format_date(item.get("created_at", ""))
    type_label = item_type.replace("_", " ")
    
    parts = [f'<div class="pulse-card type-{escape(item_type)}">']
    parts.append(f'  <div class="pulse-meta">')
    parts.append(f'    <span class="pulse-type">{escape(type_label)}</span>')
    parts.append(f'    <span class="pulse-date">{escape(date_str)}</span>')
    parts.append(f'  </div>')
    
    # Title
    title = item.get("title") or item.get("topic") or ""
    if title:
        parts.append(f'  <div class="pulse-title">{escape(title)}</div>')
    
    # Content body
    if item_type == "twitter_thread" and "tweets" in item:
        parts.append('  <ul class="thread-tweets">')
        for tweet in item["tweets"]:
            parts.append(f'    <li>{escape(tweet)}</li>')
        parts.append('  </ul>')
    elif item_type == "blog_outline" and "outline" in item:
        parts.append('  <ul class="outline-list">')
        for point in item["outline"]:
            parts.append(f'    <li>{escape(point)}</li>')
        parts.append('  </ul>')
    elif item_type == "tool_showcase":
        desc = item.get("description", "")
        if desc:
            parts.append(f'  <div class="pulse-content">{escape(desc)}</div>')
        if "bullets" in item:
            parts.append('  <ul class="pulse-bullets">')
            for b in item["bullets"]:
                parts.append(f'    <li>{escape(b)}</li>')
            parts.append('  </ul>')
    elif "content" in item:
        parts.append(f'  <div class="pulse-content">{escape(item["content"])}</div>')
    elif "text" in item:
        parts.append(f'  <div class="pulse-content">{escape(item["text"])}</div>')
    
    # Tags
    tags = item.get("tags", [])
    if tags:
        parts.append('  <div class="pulse-tags">')
        for tag in tags:
            parts.append(f'    <span class="pulse-tag">#{escape(tag)}</span>')
        parts.append('  </div>')
    
    parts.append('</div>')
    return "\n".join(parts)

def main():
    # Load queue
    with open(QUEUE_FILE, "r", encoding="utf-8") as f:
        queue = json.load(f)
    
    pending = queue.get("pending", [])
    posted = queue.get("posted", [])
    
    # All items (posted first as archive, then pending as new)
    all_items = pending + posted
    
    if not all_items:
        print("No items to process.")
        return
    
    # Sort by date, newest first
    def sort_key(item):
        try:
            return datetime.fromisoformat(item.get("created_at", "2000-01-01"))
        except:
            return datetime(2000, 1, 1)
    
    all_items.sort(key=sort_key, reverse=True)
    
    # Render all pulses
    html_parts = []
    html_parts.append(f'<div class="pulse-count">{len(all_items)} transmissions logged</div>')
    
    for item in all_items:
        html_parts.append(render_pulse(item))
    
    pulses_html = "\n\n".join(html_parts)
    
    # Read template and inject
    with open(PULSES_FILE, "r", encoding="utf-8") as f:
        template = f.read()
    
    # Replace the placeholder content
    marker = "<!-- PULSES_CONTENT -->"
    if marker in template:
        template = template.replace(marker, pulses_html)
    else:
        # Replace everything between pulse-feed div tags
        import re
        template = re.sub(
            r'(<div class="pulse-feed" id="pulse-feed">).*?(</div>\s*</main>)',
            rf'\1\n{pulses_html}\n\2',
            template,
            flags=re.DOTALL
        )
    
    # Write updated pulses.html
    with open(PULSES_FILE, "w", encoding="utf-8") as f:
        f.write(template)
    
    # Move pending to posted
    now = datetime.now().isoformat()
    for item in pending:
        item["posted_at"] = now
        posted.append(item)
    
    queue["pending"] = []
    queue["posted"] = posted
    queue["last_build"] = now
    
    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=2, ensure_ascii=False)
    
    print(f"Built {len(all_items)} pulses into pulses.html")
    print(f"Moved {len(pending)} items from pending to posted")

if __name__ == "__main__":
    main()
