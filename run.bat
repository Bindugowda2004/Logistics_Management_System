@echo off
echo Starting Logistics Management System...

echo Starting Spring Boot Backend...
start cmd /k "cd %~dp0 && mvn spring-boot:run"

echo Starting React Frontend...
start cmd /k "cd %~dp0frontend && npm start"

echo Logistics Management System is starting up!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000

cd %~dp0
