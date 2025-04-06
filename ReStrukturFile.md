# Frontend File Structure

```
src/
├── assets/                    # Static assets
│   ├── images/               # Image assets
│   ├── icons/                # Icon assets
│   └── fonts/                # Font files
│
├── components/               # Reusable components
│   ├── common/              # Generic UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   └── Loading.jsx
│   │
│   ├── product/            # Product-related components
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductFilter.jsx
│   │   ├── ReviewForm.jsx
│   │   └── ReviewList.jsx
│   │
│   ├── cart/              # Shopping cart components
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   │
│   ├── checkout/          # Checkout components
│   │   ├── CheckoutForm.jsx
│   │   ├── PaymentForm.jsx
│   │   └── OrderSummary.jsx
│   │
│   └── dashboard/         # Dashboard-specific components
│       ├── Stats.jsx
│       ├── Charts.jsx
│       └── Tables.jsx
│
├── layouts/               # Layout components
│   ├── components/        # Layout-specific components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── PublicLayout.jsx       # Public layout
│   └── DashboardLayout.jsx  # Admin layout
│
├── pages/                # Page components
│   ├── public/          # Public-facing pages
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   └── Search.jsx
│   │
│   ├── auth/            # Authentication pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   │
│   └── dashboard/       # Admin/Dashboard pages
│       ├── Dashboard.jsx
│       ├── Orders.jsx
│       ├── Products.jsx
│       ├── Customers.jsx
│       ├── Profile.jsx
│       └── Settings.jsx
│
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useForm.js
│   └── useProducts.js
│
├── services/           # API services
│   ├── api.js         # Base API setup
│   ├── auth.js        # Auth services
│   ├── products.js    # Product services
│   └── orders.js      # Order services
│
├── utils/             # Utility functions
│   ├── constants.js   # App constants
│   ├── helpers.js     # Helper functions
│   └── validation.js  # Form validation
│
├── styles/            # Styling
│   ├── theme.js      # MUI theme
│   ├── globals.css   # Global styles
│   └── variables.css # CSS variables
│
└── context/          # React Context
    ├── AuthContext.js
    ├── CartContext.js
    └── ThemeContext.js
```

## Notes
- All components should be placed in their respective directories
- Each component should have its own directory with associated files
- Avoid creating duplicate component structures
- Follow this structure when adding new files
- Keep related files close to each other