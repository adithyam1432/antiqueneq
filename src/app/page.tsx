import HeroScene from '@/components/three/HeroScene';
import { ArrowRight, ShoppingBag, ShieldCheck, History } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.nav}>
        <div className={styles.logo}>
          <History className={styles.logoIcon} />
          <span>Antiquity</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#explore">Explore</a>
          <a href="#sell">Sell</a>
          <a href="/login" className="button-outline">Login</a>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>India's Premier Marketplace</span>
          <h1 className="gold-gradient">Timeless Treasures, Verified for You.</h1>
          <p className={styles.heroText}>
            Experience the world's most immersive antique marketplace. 
            Discover, verify, and collect rare masterpieces with absolute confidence.
          </p>
          <div className={styles.actions}>
            <button className="button-premium">
              Explore Collections <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
            <button className="button-outline">
              Sell Your Antique <ShoppingBag size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
          
          <div className={styles.stats}>
            <div className={styles.statLine}>
              <ShieldCheck size={20} color="var(--gold)" />
              <span>100% Authenticity Guaranteed</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <HeroScene />
        </div>
      </section>

      <section id="explore" className={styles.features}>
        <h2 className="gold-gradient">Why Collector's Trust Us</h2>
        <div className={styles.featureGrid}>
          <div className="glass-card">
            <div className={styles.cardContent}>
              <ShieldCheck size={32} color="var(--gold)" />
              <h3>Gold Verification</h3>
              <p>Every item is physically inspected by our team of expert curators.</p>
            </div>
          </div>
          <div className="glass-card">
            <div className={styles.cardContent}>
              <History size={32} color="var(--gold)" />
              <h3>Traceable History</h3>
              <p>Complete provenance documentation for every rare masterpiece.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
