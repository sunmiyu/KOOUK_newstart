export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '20px' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#1f2937', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 32px',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          K
        </div>
        
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          margin: '0 0 16px 0'
        }}>
          Welcome to KOOUK
        </h1>
        
        <p style={{ 
          color: '#6b7280', 
          fontSize: '20px', 
          maxWidth: '400px',
          margin: '0 auto 32px'
        }}>
          Your personal digital life manager. Organize folders, save bookmarks, and discover amazing content.
        </p>
        
        <div style={{ marginBottom: '64px' }}>
          <a 
            href="/dashboard"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: '500',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🚀</span>
            <span>Get Started</span>
          </a>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '32px',
          marginTop: '64px'
        }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '24px', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>My Folder</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Organize your digital content in smart folders. Links, notes, images - everything in one place.
            </p>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '24px', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔖</div>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Bookmarks</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Save websites instantly. Auto-categorization and smart search make finding things effortless.
            </p>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '24px', 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
            <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Marketplace</h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Discover and import curated content collections shared by our community.
            </p>
          </div>
        </div>
        
        <div style={{ marginTop: '64px', textAlign: 'center' }}>
          <h3 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '16px' 
          }}>
            Simple. Fast. Intuitive.
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            No complex setup, no learning curve. Start organizing your digital life in seconds.
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '32px',
            fontSize: '14px', 
            color: '#9ca3af'
          }}>
            <span>✓ Free to use</span>
            <span>✓ No downloads</span>
            <span>✓ Works everywhere</span>
          </div>
        </div>
      </div>
    </div>
  )
}