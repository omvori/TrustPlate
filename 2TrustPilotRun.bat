@echo off

:: 1. Usa CALL. Senza di questo, lo script muore qui.
call angular_microservice_test\Scripts\activate

:: 2. Ora questo comando verrà eseguito

ng serve
:: 3. Mantiene il terminale aperto
cmd /k