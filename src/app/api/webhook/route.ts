import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint для Base Mini App
 * Обрабатывает уведомления от Farcaster
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Received webhook:', JSON.stringify(body, null, 2));
    
    // Обрабатываем различные типы событий
    const { event } = body;
    
    switch (event) {
      case 'frame_added':
        // Пользователь добавил Mini App
        console.log('User added the mini app');
        break;
        
      case 'frame_removed':
        // Пользователь удалил Mini App
        console.log('User removed the mini app');
        break;
        
      case 'notifications_enabled':
        // Пользователь включил уведомления
        console.log('User enabled notifications');
        break;
        
      case 'notifications_disabled':
        // Пользователь выключил уведомления
        console.log('User disabled notifications');
        break;
        
      default:
        console.log('Unknown event:', event);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Разрешаем GET для проверки работоспособности
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Coin Flip webhook endpoint'
  });
}
