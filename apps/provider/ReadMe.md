src/
├── proxy.jsx
├── config/
│ ├── env/
│ │ ├── server.js
│ │ └── client.js
│ └── portals.config.js
├── app/
│ ├── layout.jsx
│ ├── (auth)/
│ │ ├── layout.jsx
│ │ ├── login/page.jsx
│ │ └── signup/page.jsx
│ ├── (dashboard)/
│ │ ├── layout.jsx
│ │ ├── page.jsx
│ │ └── \_components/logout-button.jsx
│ └── api/auth/
│ ├── login/route.js
│ ├── signup/route.js
│ ├── logout/route.js
│ ├── refresh/route.js
│ └── me/route.js
├── features/auth/
│ ├── components/
│ ├── constants/index.js
│ ├── errors/index.js
│ ├── hooks/
│ ├── queries/
│ │ ├── auth.query.js
│ │ └── keys.js
│ ├── schemas/index.js
│ ├── services/auth-service.js
│ ├── utils/portal-access.js
│ └── index.js
├── lib/
│ ├── api/client.js
│ └── server/
│ ├── auth-cookies.js
│ ├── current-user.js
│ └── upstream.js
└── providers/providers.jsx
