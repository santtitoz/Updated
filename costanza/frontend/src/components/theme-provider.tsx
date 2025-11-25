'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
} from 'next-themes'

// ✅ CORREÇÃO: Importe o tipo separadamente com 'import type'
import type { ThemeProviderProps } from 'next-themes' 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}