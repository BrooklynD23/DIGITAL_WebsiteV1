# Fallback asset encoder when npm/sharp is unavailable (Windows).
# Generates registered layer PNGs from frame-01. Run npm run encode:teardown for AVIF/WebP.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $PSScriptRoot
$FramesSrc = Join-Path $Root 'public\assets\frames'
$LayersOut = Join-Path $Root 'public\assets\layers'
New-Item -ItemType Directory -Force -Path $LayersOut | Out-Null

$LayerRegions = @(
  @{ asset = 'layer-01-chassis'; left = 560; top = 420; width = 540; height = 480 },
  @{ asset = 'layer-02-frame';   left = 580; top = 360; width = 500; height = 520 },
  @{ asset = 'layer-03-battery'; left = 700; top = 560; width = 220; height = 160 },
  @{ asset = 'layer-04-board';   left = 640; top = 480; width = 300; height = 220 },
  @{ asset = 'layer-05-display'; left = 600; top = 300; width = 380; height = 300 },
  @{ asset = 'layer-06-glass';   left = 590; top = 260; width = 400; height = 120 }
)

$sourcePath = Join-Path $FramesSrc 'frame-01.png'
$source = [System.Drawing.Image]::FromFile($sourcePath)
$canvasW = $source.Width
$canvasH = $source.Height

foreach ($region in $LayerRegions) {
  $canvas = New-Object System.Drawing.Bitmap $canvasW, $canvasH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

  $extract = New-Object System.Drawing.Bitmap $region.width, $region.height
  $eg = [System.Drawing.Graphics]::FromImage($extract)
  $eg.DrawImage(
    $source,
    (New-Object System.Drawing.Rectangle 0, 0, $region.width, $region.height),
    (New-Object System.Drawing.Rectangle $region.left, $region.top, $region.width, $region.height),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $eg.Dispose()

  $g.DrawImage($extract, $region.left, $region.top)
  $g.Dispose()
  $extract.Dispose()

  $outPath = Join-Path $LayersOut "$($region.asset).png"
  $canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Dispose()
  Write-Host "layer png $($region.asset).png"
}

$source.Dispose()

# Poster copy from frame-12
Copy-Item (Join-Path $FramesSrc 'frame-12.png') (Join-Path $FramesSrc 'poster-1700.png') -Force
Write-Host 'poster-1700.png (copy of frame-12)'
Write-Host 'Done. Run npm run encode:teardown for AVIF/WebP delivery.'
