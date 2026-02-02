# Start Backend Server
Write-Host "Starting Campus Lost & Found Backend..." -ForegroundColor Green

# Resolve repository root (script directory)
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Navigate to backend directory
Set-Location (Join-Path $scriptRoot 'backend')

# Set Python path
$env:PYTHONPATH = (Join-Path $scriptRoot 'backend')

# Prefer the repo virtualenv python if present, otherwise fall back to system python
$venvPython = Join-Path $scriptRoot '.venv\Scripts\python.exe'
# Prefer explicit python path returned by where.exe if available (avoids using broken venv stubs)
$whereResult = $null
try {
	$whereResult = (where.exe python) -split "\r?\n" | Select-Object -First 1
} catch {
	$whereResult = $null
}
if ($whereResult -and (Test-Path $whereResult)) {
	Write-Host "Using python from where.exe: $whereResult"
	& $whereResult -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
} elseif (Test-Path $venvPython) {
	Write-Host "Using virtualenv python: $venvPython"
	& $venvPython -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
	Write-Host "Using Windows Python launcher 'py'"
	& py -3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
	Write-Host "Using system 'python'"
	& python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
} else {
	Write-Error "No suitable Python executable found. Install Python or create .venv in the repo root."
	exit 1
}
