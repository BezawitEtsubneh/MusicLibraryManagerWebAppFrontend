import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL='https://back-3-yciv.onrender.com';


export async function GET(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    const { slug = [] } = await params;
    const path = slug.length > 0 ? `/${slug.join('/')}` : '';
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/api${path}${queryString ? `?${queryString}` : ''}`;

    console.log('[GET] Proxying to:', url);

    const headers: Record<string, string> = {};
    for (const [key, value] of request.headers.entries()) {
      const lowerKey = key.toLowerCase();
      // Forward most headers, but exclude problematic ones
      if (!['host', 'connection', 'content-length', 'content-encoding'].includes(lowerKey)) {
        headers[key] = value;
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include',
    });

    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    const { slug = [] } = await params;
    const path = slug.length > 0 ? `/${slug.join('/')}` : '';
    const url = `${BACKEND_URL}/api${path}`;

    console.log('[POST] Proxying to:', url);

    const contentType = request.headers.get('content-type');
    let body: any = null;

    if (contentType?.includes('multipart/form-data')) {
      // For multipart, pass the raw body to preserve boundary
      body = request.body;
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      body = await request.text();
    } else {
      body = await request.text();
    }

    const headers: Record<string, string> = {};
    for (const [key, value] of request.headers.entries()) {
      const lowerKey = key.toLowerCase();
      // Forward most headers, but exclude problematic ones
      if (!['host', 'connection', 'content-length', 'content-encoding'].includes(lowerKey)) {
        headers[key] = value;
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      credentials: 'include',
      ...(contentType?.includes('multipart/form-data') && { duplex: 'half' }),
    });

    const responseData = await response.json().catch(() => null);
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    const { slug = [] } = await params;
    const path = slug.length > 0 ? `/${slug.join('/')}` : '';
    const url = `${BACKEND_URL}/api${path}`;

    console.log('[PUT] Proxying to:', url);

    const contentType = request.headers.get('content-type');
    let body: any = null;

    if (contentType?.includes('multipart/form-data')) {
      // For multipart, pass the raw body to preserve boundary
      body = request.body;
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      body = await request.text();
    } else {
      body = await request.text();
    }

    const headers: Record<string, string> = {};
    for (const [key, value] of request.headers.entries()) {
      const lowerKey = key.toLowerCase();
      // Forward most headers, but exclude problematic ones
      if (!['host', 'connection', 'content-length', 'content-encoding'].includes(lowerKey)) {
        headers[key] = value;
      }
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body,
      credentials: 'include',
      ...(contentType?.includes('multipart/form-data') && { duplex: 'half' }),
    });

    const responseData = await response.json().catch(() => null);
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    const { slug = [] } = await params;
    const path = slug.length > 0 ? `/${slug.join('/')}` : '';
    const url = `${BACKEND_URL}/api${path}`;

    console.log('[DELETE] Proxying to:', url);

    const headers: Record<string, string> = {};
    for (const [key, value] of request.headers.entries()) {
      const lowerKey = key.toLowerCase();
      // Forward most headers, but exclude problematic ones
      if (!['host', 'connection', 'content-length', 'content-encoding'].includes(lowerKey)) {
        headers[key] = value;
      }
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    const responseData = await response.json().catch(() => null);
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend', details: String(error) },
      { status: 500 }
    );
  }
}

