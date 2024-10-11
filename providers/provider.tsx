'use client';

import { db } from '@/config/db';
import { Users } from '@/config/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useEffect } from 'react'

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useUser();

    useEffect(() => {
        user && isNewUser();
    }, [user])

    const isNewUser = async () => {
        const result = await db
            .select()
            .from(Users)
            .where(eq(Users.username, user?.username ?? ''))

        console.log(result);

        if (!result[0]) await db
            .insert(Users)
            .values({
                name: user?.fullName ?? '',
                username: user?.username ?? '',
                email: user?.primaryEmailAddress?.emailAddress ?? '',
                imageUrl: user?.imageUrl ?? '',
            })
    }

    return <div>
        {children}
    </div>
}