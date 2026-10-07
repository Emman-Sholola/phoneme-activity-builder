import {
  NextResponse,
} from "next/server";

import {
  getDashboardReport,
} from "@/lib/reporting";

export async function GET() {
  try {
    const report =
      await getDashboardReport();

    return NextResponse.json(
      report,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to generate dashboard report:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate dashboard report.",
      },
      {
        status: 500,
      },
    );
  }
}