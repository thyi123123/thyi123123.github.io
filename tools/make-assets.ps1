Add-Type -AssemblyName System.Drawing

New-Item -ItemType Directory -Force -Path "assets" | Out-Null

function New-Canvas {
  param([string]$Path, [int]$Width = 1400, [int]$Height = 900, [string]$Mode)

  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $rect = New-Object System.Drawing.Rectangle 0, 0, $Width, $Height
  $bg1 = [System.Drawing.Color]::FromArgb(238, 243, 246)
  $bg2 = [System.Drawing.Color]::FromArgb(139, 158, 168)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $bg1, $bg2, 35
  $graphics.FillRectangle($brush, $rect)

  $random = New-Object System.Random 42
  for ($i = 0; $i -lt 55; $i++) {
    $x = $random.Next(-120, $Width)
    $y = $random.Next(120, $Height + 60)
    $w = $random.Next(100, 320)
    $h = $random.Next(26, 72)
    $colors = @(
      [System.Drawing.Color]::FromArgb(184, 95, 55),
      [System.Drawing.Color]::FromArgb(193, 147, 69),
      [System.Drawing.Color]::FromArgb(82, 103, 113),
      [System.Drawing.Color]::FromArgb(180, 190, 194),
      [System.Drawing.Color]::FromArgb(37, 112, 91)
    )
    $color = $colors[$random.Next(0, $colors.Length)]
    if ($Mode -eq "copper") { $color = [System.Drawing.Color]::FromArgb($random.Next(150, 215), $random.Next(72, 118), $random.Next(38, 72)) }
    if ($Mode -eq "aluminum") { $color = [System.Drawing.Color]::FromArgb($random.Next(156, 224), $random.Next(168, 228), $random.Next(174, 235)) }
    if ($Mode -eq "electronics") { $color = @([System.Drawing.Color]::FromArgb(35, 111, 91), [System.Drawing.Color]::FromArgb(42, 61, 78), [System.Drawing.Color]::FromArgb(189, 146, 60))[$random.Next(0, 3)] }
    $solid = New-Object System.Drawing.SolidBrush $color
    $graphics.TranslateTransform(($x + ($w / 2)), ($y + ($h / 2)))
    $graphics.RotateTransform($random.Next(-16, 16))
    $graphics.FillRectangle($solid, -($w / 2), -($h / 2), $w, $h)
    $graphics.ResetTransform()
    $solid.Dispose()
  }

  if ($Mode -eq "hero" -or $Mode -eq "facility") {
    $sky = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(219, 229, 235))
    $graphics.FillRectangle($sky, 0, 0, $Width, 250)
    $sky.Dispose()
    $yard = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(61, 77, 86))
    $graphics.FillRectangle($yard, 0, 575, $Width, 325)
    $yard.Dispose()
    $building = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(191, 201, 207))
    $graphics.FillRectangle($building, 690, 250, 520, 320)
    $graphics.FillRectangle($building, 120, 330, 430, 220)
    $building.Dispose()
    $roof = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(52, 81, 95))
    $points = @(
      (New-Object System.Drawing.Point 650, 250),
      (New-Object System.Drawing.Point 1240, 250),
      (New-Object System.Drawing.Point 1160, 185),
      (New-Object System.Drawing.Point 730, 185)
    )
    $graphics.FillPolygon($roof, $points)
    $roof.Dispose()
  }

  $overlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(0, 255, 255, 255)), ([System.Drawing.Color]::FromArgb(82, 0, 0, 0)), 90
  $graphics.FillRectangle($overlay, $rect)
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $overlay.Dispose()
  $brush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

New-Canvas -Path "assets/hero-metal-yard.png" -Mode "hero"
New-Canvas -Path "assets/facility-overview.png" -Mode "facility"
New-Canvas -Path "assets/material-copper.png" -Mode "copper"
New-Canvas -Path "assets/material-aluminum.png" -Mode "aluminum"
New-Canvas -Path "assets/electronics-recycling.png" -Mode "electronics"
