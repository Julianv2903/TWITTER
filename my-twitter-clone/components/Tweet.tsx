// components/Tweet.tsx
import React from 'react';

export default function Tweet({ tweet }: any) {
  const date = new Date(tweet.created_at).toLocaleString();
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8, borderRadius: 8 }}>
      <div style={{ fontWeight: 600 }}>
        @{tweet.profiles?.username ?? 'unknown'}
      </div>
      <div style={{ marginTop: 8 }}>{tweet.content}</div>
      <div style={{ color: '#666', marginTop: 8, fontSize: 12 }}>{date}</div>
    </div>
  );
}
