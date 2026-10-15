$ErrorActionPreference = 'Stop'
$assets = @{
  'logo-word.png' = 'e4ac7f95-f568-4b52-82f0-7ede57e2626b/e1108.png'
  'logo-mark.png' = 'e4ac7f95-f568-4b52-82f0-7ede57e2626b/efe28.png'
  'logo-word-mask.svg' = 'e4ac7f95-f568-4b52-82f0-7ede57e2626b/4adb7.svg'
  'logo-mark-mask.svg' = 'e4ac7f95-f568-4b52-82f0-7ede57e2626b/d9a3d.svg'
  'max.svg' = 'e4ac7f95-f568-4b52-82f0-7ede57e2626b/e6451.svg'
  'search.svg' = 'e4ac7f95-f568-4b52-82f0-7ede57e2626b/4dca3.svg'
  'down.svg' = 'e4ac7f95-f568-4b52-82f0-7ede57e2626b/fa195.svg'
  'hero-base.png' = 'd8451658-72c3-4535-8bce-8c4662598f5b/b3633.png'
  'hero-overlay.png' = 'd8451658-72c3-4535-8bce-8c4662598f5b/200ca.png'
  'hero-main.png' = 'd8451658-72c3-4535-8bce-8c4662598f5b/0f4d4.png'
  'info-heart.png' = '096acf93-c445-48c9-b090-1fab8f68545e/7de7f.png'
  'info-stethoscope.png' = '096acf93-c445-48c9-b090-1fab8f68545e/7fb2b.png'
  'vaccine.png' = '02180731-da0e-4291-878d-8a5fdd01161f/f965c.png'
  'doctor.png' = '56323120-0a17-48a5-be23-13e6c1d94b5c/36a7c.png'
  'values-main.png' = 'fb9e8a65-d091-40f5-bd50-4fc6222fd5ea/76b3c.png'
  'values-1.png' = 'fb9e8a65-d091-40f5-bd50-4fc6222fd5ea/d250c.png'
  'values-2.png' = 'fb9e8a65-d091-40f5-bd50-4fc6222fd5ea/8ed4c.png'
  'values-3.png' = 'fb9e8a65-d091-40f5-bd50-4fc6222fd5ea/dc4b1.png'
  'values-4.png' = 'fb9e8a65-d091-40f5-bd50-4fc6222fd5ea/775bb.png'
  'star.svg' = 'f87cf494-1346-41f9-bd2f-eae597850d57/cbe7c.svg'
  'star-empty.svg' = 'f87cf494-1346-41f9-bd2f-eae597850d57/3e7e4.svg'
  'rating.png' = '1759660e-c43b-41f7-9dab-ab4eeb78bb58/afe6b.png'
  'rating-layer-1.png' = '1759660e-c43b-41f7-9dab-ab4eeb78bb58/833fa.png'
  'rating-layer-2.png' = '1759660e-c43b-41f7-9dab-ab4eeb78bb58/19c4b.png'
  'rating-layer-3.png' = '1759660e-c43b-41f7-9dab-ab4eeb78bb58/51104.png'
  'rating-layer-4.png' = '1759660e-c43b-41f7-9dab-ab4eeb78bb58/4c2ca.png'
  'clock-24-7.png' = '5970b22f-d8ed-48d8-bf67-b156c53a3ca2/18a61.png'
  'map.png' = '5970b22f-d8ed-48d8-bf67-b156c53a3ca2/ccf21.png'
  'price-chevron-down.svg' = '02180731-da0e-4291-878d-8a5fdd01161f/f5d23.svg'
  'price-chevron-up.svg' = '02180731-da0e-4291-878d-8a5fdd01161f/9f4fa.svg'
  'price-info.svg' = '02180731-da0e-4291-878d-8a5fdd01161f/24c13.svg'
  'link-arrow.svg' = '02180731-da0e-4291-878d-8a5fdd01161f/4efac.svg'
  'faq-minus.svg' = '639d2dcc-9426-4e8c-8248-21606ea2eae9/5abde.svg'
  'faq-minus-accent.svg' = '639d2dcc-9426-4e8c-8248-21606ea2eae9/8b2a3.svg'
  'faq-plus.svg' = '639d2dcc-9426-4e8c-8248-21606ea2eae9/c41e3.svg'
}
New-Item -ItemType Directory -Path (Join-Path $PSScriptRoot 'assets') -Force | Out-Null
foreach ($name in $assets.Keys) {
  $destination = Join-Path $PSScriptRoot "assets/$name"
  if (-not (Test-Path $destination)) {
    Invoke-WebRequest -Uri "https://www.figma.com/api/mcp/asset/$($assets[$name])" -OutFile $destination
  }
  $file = Get-Item $destination
  Write-Output "$name $($file.Length)"
}
