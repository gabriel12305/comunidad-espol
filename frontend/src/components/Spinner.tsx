import styles from './Spinner.module.css';

export default function Spinner() {
  return (
    <div className={styles.contenedor} role="status" aria-label="Cargando">
      <div className={styles.spinner} />
    </div>
  );
}
