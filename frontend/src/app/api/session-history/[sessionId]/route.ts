
// import { NextResponse } from 'next/server';

// export async function GET(
//   request: Request,
//   { params }: { params: { sessionId: string } }
// ) {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_QUESTION_API_URL}/questionhistories/${params.sessionId}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!res.ok) {
//       console.error('Error fetching session history:', res.statusText);
//       return NextResponse.json({ error: 'Failed to fetch session history' }, { status: res.status });
//     }

//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     console.error('Error parsing JSON response:', error);
//     return NextResponse.json({ error: 'Failed to fetch session history' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const res = await fetch(`${process.env.MONGODB_URI}/code-editor/${params.sessionId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching session history:', res.statusText);
      return NextResponse.json({ error: 'Failed to fetch session history' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    return NextResponse.json({ error: 'Failed to fetch session history' }, { status: 500 });
  }
}