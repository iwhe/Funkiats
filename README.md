<h2>Funkiats</h2>

<p>Funkiats is a web application that uses machine learning to analyze the user's emotions and provide personalized music recommendations.</p>

## API Flow

### Recommended Flow (Pre-authentication):
```
1. frontend → backend(auth api) → spotify api → callback → frontend (with cookies)
2. frontend (recommend music) → backend(playlist api) → success
```

### Current Flow (Problematic):
```
frontend (recommend music) → backend(playlist api) → backend(auth_check) → 
frontend → backend(auth api) → spotify api → callback → frontend
```

**Issues with current flow:**
- Original API request is abandoned
- Cookies set after the request that needs them
- Poor user experience with unexpected redirects

**Solution:** Authenticate users before they access protected features.
