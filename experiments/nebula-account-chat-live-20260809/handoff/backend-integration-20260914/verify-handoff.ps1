[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$handoffRoot = Split-Path -Parent $PSCommandPath
$variantRoot = Split-Path -Parent (Split-Path -Parent $handoffRoot)

$required = @(
    'VARIANT-README.md',
    'source/LIGHT-PROFILE-PACKET.json',
    'source/LIGHT-CHATROOM-PACKET.json',
    'precode/contracts.json',
    'yii2/modules/nebulaAccount/config/routes.php',
    'yii2/modules/nebulaAccount/controllers/ProfileController.php',
    'yii2/modules/nebulaAccount/controllers/ChatroomController.php',
    'yii2/modules/nebulaAccount/assets/ProfileAsset.php',
    'yii2/modules/nebulaAccount/assets/ChatroomAsset.php',
    'proof/module-inventory/final/coverage-audit.json',
    'proof/module-inventory/frontend-host-intent-milestone-closeout-2026-08-13.md',
    'proof/module-inventory/backend-owner-questionnaire-2026-08-12.md'
)

$rows = foreach ($relativePath in $required) {
    $fullPath = Join-Path $variantRoot $relativePath
    [pscustomobject]@{
        path = $relativePath
        exists = Test-Path -LiteralPath $fullPath -PathType Leaf
        sha256 = if (Test-Path -LiteralPath $fullPath -PathType Leaf) { (Get-FileHash -LiteralPath $fullPath -Algorithm SHA256).Hash } else { $null }
    }
}

$missing = @($rows | Where-Object { -not $_.exists })
$result = [pscustomobject]@{
    schema = 'nebula.cabinet_chat_handoff_verification.v1'
    status = if ($missing.Count -eq 0) { 'pass_structure_only' } else { 'fail_missing_required_files' }
    variant_root = $variantRoot
    checked_at_utc = [DateTime]::UtcNow.ToString('o')
    files = $rows
    missing = $missing.path
    limitation = 'This validates handoff composition only. It does not prove backend, auth, payment, persistence or production runtime.'
}

$result | ConvertTo-Json -Depth 4
if ($missing.Count -gt 0) { exit 1 }
