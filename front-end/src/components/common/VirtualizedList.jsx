import React from 'react';
import { Box } from '@mui/material';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const VirtualizedList = ({ items, itemHeight = 50, renderItem }) => {
  const Row = ({ index, style }) => (
    <Box style={style}>
      {renderItem(items[index], index)}
    </Box>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={items.length}
          itemSize={itemHeight}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default VirtualizedList;
