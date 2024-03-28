# Why not TRPC

In the long term, TRPC is better than server actions. It is decoupled from Vercel, and is more maintainable as the app scaled. If we had 6 months of clear runway, we would switch from server actions to TRPC. However, we don't know if we have even 3 months. Therefore, we stick with the mantra - "Do things that don't scale", and we move on. If we survive, we will switch to TRPC. If we don't, it doesn't matter.
