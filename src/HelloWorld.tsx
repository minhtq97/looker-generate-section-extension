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

import React, { useContext, useEffect, useState } from 'react'
import { ComponentsProvider, Space, Span, Button, Box, Heading } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'

/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const HelloWorld: React.FC = () => {
  const extensionContext = useContext(ExtensionContext)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getMe = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if we're running inside Looker
        if (!extensionContext || !extensionContext.core40SDK) {
          setError('Extension is not running inside Looker environment')
          setIsLoading(false)
          return
        }

        const me = await extensionContext.core40SDK.ok(extensionContext.core40SDK.me())
        setMessage(`Hello, ${me.display_name}`)
        setIsLoading(false)
      } catch (error) {
        console.error('Error getting user info:', error)
        setError('An error occurred while getting information about me!')
        setIsLoading(false)
      }
    }
    getMe()
  }, [extensionContext])

  // Show loading state
  if (isLoading) {
    return (
      <ComponentsProvider>
        <Space around>
          <Span fontSize="large">Loading...</Span>
        </Space>
      </ComponentsProvider>
    )
  }

  // Show error state
  if (error) {
    return (
      <ComponentsProvider>
        <Box p="large">
          <Space vertical>
            <Heading as="h1" fontSize="large" color="critical">
              {error}
            </Heading>
            <Span fontSize="medium">
              This extension needs to run inside a Looker environment.
            </Span>
            <Button 
              onClick={() => window.location.reload()}
              size="small"
            >
              Retry
            </Button>
          </Space>
        </Box>
      </ComponentsProvider>
    )
  }

  // Show success state
  return (
    <ComponentsProvider>
      <Space around>
        <Span fontSize="xxxxxlarge">
          {message}
        </Span>
      </Space>
    </ComponentsProvider>
  )
}
