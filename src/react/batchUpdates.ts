import { setBatchUpdates } from '../core';
import { unstable_batchedUpdates } from 'react-dom';

setBatchUpdates(unstable_batchedUpdates);
