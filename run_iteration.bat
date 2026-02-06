@echo off
setlocal
cd /d "C:\Users\curre\.openclaw\workspace"
echo Starting Dani's Autonomous Work Iteration at %DATE% %TIME% >> dani\log.md

:: Simple state check
type dani\status.json

:: Run logic (This is where I'd spawn a sub-agent to do the actual work)
:: For now, we'll just log that the job ran.
echo Job %1 executed. >> dani\log.md

:: Commit logs
git -C dani add .
git -C dani commit -m "Autonomous update from job %1"
git -C dani push origin main

endlocal
