// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'

window.addEventListener('DOMContentLoaded', (_) => {
  const root = document.createElement('div');
  root.className = 'tw-rebate-create-section-ext';
  root.style.height = '100%';
  document.body.appendChild(root)
  ReactDOM.render(<App />, root)
})
