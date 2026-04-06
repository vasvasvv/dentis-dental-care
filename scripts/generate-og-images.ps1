Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$publicDir = Join-Path $PSScriptRoot "..\public"

$pages = @(
  @{ File = "og-image.jpg"; Title = "Dentis"; Subtitle = "Dentistry in Kropyvnytskyi"; Badge = "Dentis" },
  @{ File = "og-image-implantaciya.jpg"; Title = "Dental Implants"; Subtitle = "Digital diagnostics and modern implant systems"; Badge = "Dentis" },
  @{ File = "og-image-protezuvannya.jpg"; Title = "Dental Prosthetics"; Subtitle = "Crowns, bridges and restorative solutions"; Badge = "Dentis" },
  @{ File = "og-image-likuvannya-kariesu.jpg"; Title = "Caries Treatment"; Subtitle = "Comfortable fillings and precise diagnostics"; Badge = "Dentis" },
  @{ File = "og-image-profesijne-ochischennya.jpg"; Title = "Professional Cleaning"; Subtitle = "Air Flow, scaling and preventive care"; Badge = "Dentis" },
  @{ File = "og-image-estetychna-stomatolohiya.jpg"; Title = "Cosmetic Dentistry"; Subtitle = "Whitening, veneers and smile design"; Badge = "Dentis" },
  @{ File = "og-image-diagnostika-zubiv.jpg"; Title = "Dental Diagnostics"; Subtitle = "Consultation, X-ray and treatment planning"; Badge = "Dentis" },
  @{ File = "og-image-blog.jpg"; Title = "Dentis Blog"; Subtitle = "Dentist tips, updates and current offers"; Badge = "Dentis" },
  @{ File = "og-image-contacts.jpg"; Title = "Dentis Contacts"; Subtitle = "Address, booking phone and location"; Badge = "Dentis" }
)

function New-RoundedRectanglePath([int]$x, [int]$y, [int]$width, [int]$height, [int]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $radius * 2
  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-JpegEncoderParameters([long]$quality) {
  $encoder = [System.Drawing.Imaging.Encoder]::Quality
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, $quality)
  return $params
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-JpegEncoderParameters 88

foreach ($page in $pages) {
  $bitmap = New-Object System.Drawing.Bitmap(1200, 630)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $background = New-Object System.Drawing.Rectangle(0, 0, 1200, 630)
  $gradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $background,
    [System.Drawing.Color]::FromArgb(255, 13, 28, 43),
    [System.Drawing.Color]::FromArgb(255, 31, 52, 76),
    22
  )
  $graphics.FillRectangle($gradient, $background)

  $accentGlow1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, 255, 219, 145))
  $accentGlow2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 255, 255, 255))
  $gold = [System.Drawing.Color]::FromArgb(255, 201, 161, 92)
  $cream = [System.Drawing.Color]::FromArgb(255, 246, 240, 231)
  $muted = [System.Drawing.Color]::FromArgb(235, 223, 214, 199)
  $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(72, 255, 255, 255))
  $goldBrush = New-Object System.Drawing.SolidBrush($gold)
  $creamBrush = New-Object System.Drawing.SolidBrush($cream)
  $mutedBrush = New-Object System.Drawing.SolidBrush($muted)
  $whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(48, 255, 255, 255), 2)

  $graphics.FillEllipse($accentGlow1, 820, -140, 420, 420)
  $graphics.FillEllipse($accentGlow2, -140, 340, 420, 420)

  $panelPath = New-RoundedRectanglePath 72 72 1056 486 34
  $graphics.FillPath($panelBrush, $panelPath)
  $graphics.DrawPath($whitePen, $panelPath)

  $badgeFont = New-Object System.Drawing.Font("Segoe UI Semibold", 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $titleFont = New-Object System.Drawing.Font("Georgia", 48, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $subtitleFont = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $footerFont = New-Object System.Drawing.Font("Segoe UI Semibold", 19, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

  $graphics.DrawString($page.Badge.ToUpper(), $badgeFont, $goldBrush, 120, 120)
  $graphics.DrawString($page.Title, $titleFont, $creamBrush, (New-Object System.Drawing.RectangleF(116, 188, 760, 170)))
  $graphics.DrawString($page.Subtitle, $subtitleFont, $mutedBrush, (New-Object System.Drawing.RectangleF(120, 360, 650, 100)))
  $graphics.DrawString("dentis.kr.ua", $footerFont, $goldBrush, 120, 498)
  $graphics.DrawString("Kropyvnytskyi", $footerFont, $mutedBrush, 886, 498)

  $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(164, 201, 161, 92), 4)
  $graphics.DrawLine($linePen, 120, 468, 260, 468)
  $graphics.DrawArc($linePen, 880, 156, 156, 156, 18, 294)
  $graphics.DrawArc($linePen, 920, 196, 76, 76, 18, 294)

  $output = Join-Path $publicDir $page.File
  $bitmap.Save($output, $jpegCodec, $encoderParams)

  $panelPath.Dispose()
  $linePen.Dispose()
  $whitePen.Dispose()
  $panelBrush.Dispose()
  $goldBrush.Dispose()
  $creamBrush.Dispose()
  $mutedBrush.Dispose()
  $accentGlow1.Dispose()
  $accentGlow2.Dispose()
  $badgeFont.Dispose()
  $titleFont.Dispose()
  $subtitleFont.Dispose()
  $footerFont.Dispose()
  $gradient.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
