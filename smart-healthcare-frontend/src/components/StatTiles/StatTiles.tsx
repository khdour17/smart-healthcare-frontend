import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

import styles from './StatTiles.module.scss';

export interface StatTile {
  label: string;
  value: string;
}

interface StatTilesProps {
  tiles: StatTile[];
}

export function StatTiles({ tiles }: StatTilesProps) {
  return (
    <Box className={styles.tiles}>
      {tiles.map((tile) => (
        <Paper key={tile.label} variant="outlined" className={styles.tile}>
          <Typography variant="body2" color="textSecondary">{tile.label}</Typography>
          <Typography variant="h6" className={styles.value}>{tile.value}</Typography>
        </Paper>
      ))}
    </Box>
  );
}
