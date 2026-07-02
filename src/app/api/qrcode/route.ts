import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const menuUrl = `${protocol}://${host}/menu`;

    const searchParams = request.nextUrl.searchParams;
    const size = parseInt(searchParams.get("size") || "400");
    const format = searchParams.get("format") || "json"; // json | png | svg

    if (format === "png") {
      const buffer = await QRCode.toBuffer(menuUrl, {
        width: size,
        margin: 2,
        color: { dark: "#2d6a4f", light: "#fefae0" },
        type: "png",
      });
      const uint8 = new Uint8Array(buffer);
      return new NextResponse(uint8, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": "attachment; filename=yadi-ketfo-qr.png",
          "Cache-Control": "no-store",
        },
      });
    }

    if (format === "svg") {
      const svg = await QRCode.toString(menuUrl, {
        type: "svg",
        width: size,
        margin: 2,
        color: { dark: "#2d6a4f", light: "#fefae0" },
      });
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-store",
        },
      });
    }

    // Default: return JSON with dataURL for small, medium, large
    const [small, medium, large] = await Promise.all([
      QRCode.toDataURL(menuUrl, {
        width: 200,
        margin: 2,
        color: { dark: "#2d6a4f", light: "#fefae0" },
      }),
      QRCode.toDataURL(menuUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#2d6a4f", light: "#fefae0" },
      }),
      QRCode.toDataURL(menuUrl, {
        width: 800,
        margin: 2,
        color: { dark: "#2d6a4f", light: "#fefae0" },
      }),
    ]);

    return NextResponse.json({
      menuUrl,
      qrDataUrl: medium,
      sizes: { small, medium, large },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
