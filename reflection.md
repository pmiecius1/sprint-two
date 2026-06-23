# Reflection

## Persistent storage

I asked Claude Code to recommend how to permanently save documents
(notes, collections, tags), with localStorage and sessionStorage ruled
out (those only save data in the browser, so it would disappear or be
visible to no one else if you switched devices).

It suggested Supabase, a hosted database service we were already
using for sign-in. It compared this against three alternatives:

- Building a separate custom backend server — more control, but would
  mean rebuilding the sign-in and permission checks Supabase already
  handles for us.
- Firebase — a similar all-in-one service, but better suited to
  loosely-structured data, which is awkward for notes that have tags
  and collections attached to them.
- A self-hosted database with our own sign-in system — directly
  against the project rule of never building custom authentication.

I went with Supabase because the core requirement — a user must only
ever see their own documents — maps directly onto a feature called
Row Level Security (RLS): a rule, enforced by the database itself,
that filters out any row that doesn't belong to the current user.
Splitting sign-in and data storage across two different services
would have made that protection harder to guarantee, not easier.

## Authentication / route-protection issue caught and fixed

While adding per-user protection to documents, I found that the
database's access rules for notes, collections, and tags were set to
"any signed-in user can see this" — meaning any account could see
*every* user's documents, not just their own. I expected each user to
only ever see their own data.

I fixed it by adding an "owner" field to each table (recording which
user created each row) and rewriting the access rules so they only
allow a user to see, edit, or delete rows they own. I verified the fix
by simulating a second account directly against the database and
confirming it saw zero of the first account's notes, collections, or
tags.

## A prompt the agent misinterpreted

I asked for the ability to rename a collection. Claude Code built a
"Rename" button that only appeared when hovering over a collection
name, which opened a small popup box to type the new name.

I didn't like that — I wanted to rename a collection by clicking
directly on its name. In my next prompt I said so explicitly: "I want
to be able to update Collection Name by clicking on it." Claude Code
then replaced the hover button with editing-in-place: clicking the
title turns it into a text box right there, saved when you press
Enter or click away, cancelled if you press Escape.
