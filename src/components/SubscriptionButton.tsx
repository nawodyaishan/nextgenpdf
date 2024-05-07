'use client';

import * as React from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

type Props = { isPro: boolean };

export default function SubscriptionButton({ isPro }: Props) {
  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button disabled={loading} onClick={handleSubscription} variant="outline">
      {isPro ? 'Manage Subscriptions' : 'Get Pro'}
    </Button>
  );
}
