#!/usr/bin/env node

import { start } from '../lib/index.js';

// Proxy port to listen on
const PORT = 3001;

// Proxy path
const PATH = 'proxy';

// Target API base URL
const TARGET_API_BASE = 'https://example.com/api';

// Access-Control-Allow-Origin value 
const ALLOW_ORIGIN = '*';

start(PORT, PATH, TARGET_API_BASE, ALLOW_ORIGIN)