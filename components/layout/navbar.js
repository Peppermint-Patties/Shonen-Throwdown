import React from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useRouter } from 'next/router';

const Navbar = () => {
	const router = useRouter();
	const supabaseClient = useSupabaseClient();
	const user = useUser();
	const signOutHandler = async () => {
		await supabaseClient.auth.signOut();
		router.push('/login');
	};
	return (
		<div className={styles.nav}>
			<Link className={styles.link} href="/">
				Home
			</Link>
			<Link className={styles.link} href="/news">
				News and Updates
			</Link>
			<Link className={styles.link} href="/about">
				About
			</Link>
			<Link className={styles.link} href="/how-to-play">
				How to Play
			</Link>
			<Link className={styles.link} href="/collection">
				Cards
			</Link>
			{user && (
				<Link className={styles.link} href="/market">
					Market
				</Link>
			)}
			{user && (
				<Link className={styles.link} href="/lobby">
					Play!
				</Link>
			)}
			{!user && (
				<Link className={styles.link} href="/login">
					Login/Sign Up
				</Link>
			)}
			{user && (
				<Link className={styles.link} href="/user">
					Account
				</Link>
			)}
			{user && <button onClick={() => signOutHandler()}>Sign Out</button>}
		</div>
	);
};

export default Navbar;
