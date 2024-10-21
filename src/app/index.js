import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  console.log('i am here')
  useEffect(() => {
    router.push('./auth/signin');
  }, [router]);

  return null; 
}
