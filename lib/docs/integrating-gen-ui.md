Integrating Gen UI or vercel AI SDK 3 will not be simply refactoring the old chat interface to use the new features provided by the SDK. This is due to the following reasons

1. The old chat interface useChat hook that points to a route on the backend. The chat components are tightly coupled with the backend. And the backend is way too complex to be refactored for the new SDK.
2. The new SDK tightly couples UI with the chat interface. Before, since all the interactions were just text based, the same components could be used for different use cases. However, now the UI will be coupled with the use case for which the chat interface is being used. And therefore the same chat components cannot be used for different use cases. This is at least my hypothesis, and I will have to test it out.

However, integrating the new SDK is a must due to feeling of multi-modality it gives to the users. Also, it opens up a world where interfaces could be chat first and UI second, rather than the current model where UI is first and chat is integrated into the UI.

## Plan

1. Pick out a use case where the new SDK can be integrated.
2. Create a new chat interface for this use case using the new SDK.
3. Test out the hypothesis that the same chat components cannot be used for different use cases.
4. If the hypothesis is true, then refactor the old chat interface to use the new SDK.
5. If not, then evaluate whether it is worth refactoring the old chat interface to use the new SDK.

## What use case to pick?

We will probably be building BYOT - build your own teacher.

## Detailed Plan

1. Bring in all the components from the template into the project.
2. Refactor the components to work with the database and the backend.
3. Test with a simple chat interface.
