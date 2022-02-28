import { css, Global } from '@emotion/core'
import React from 'react'
import { Route, Link, useLocation } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'

import { Home } from './home'
import doodles from '../doodles.ttf'

const defaultTheme = createTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif'
  }
})
const i18nTheme = createTheme({
  typography: {
    fontFamily: 'doodles'
  }
})

const app = () => {
  const search = useLocation().search
  const i18n = new URLSearchParams(search).get('i18n')
  const isI18n = i18n === 'true'

  return (
    <ThemeProvider theme={isI18n ? i18nTheme : defaultTheme}>
      <div css={layoutStyle}>
        {isI18n && <Global styles={i18nStyle} />}
        <nav css={navStyle}>
          <ul >
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/another'>Another route</Link>
            </li>
          </ul>
        </nav>
        <div className='main-content' css={contentStyle}>
          <Route component={Home} exact path='/' />
          <Route component={() => (<div>Content for /another route</div>)} exact path='/another' />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default app

const i18nStyle = css`
  @font-face {
    font-family: doodles;
    src: url(${doodles});
  }
  body {
    font-family: doodles;
  }
`

const layoutStyle = css`
    display: grid;
    grid-row-gap: 24px;
    margin: 0 auto;
    max-width: 1275px;
    padding: 8px;
`

const navStyle = css`
  grid-row: 1;
  padding: 8px 16px;

  a {
    color: #111;
    font-size: 1.25rem;
    position: relative;
    text-decoration: none;

    &::after {
      content: "";
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 100%;
      border-top: 2px solid #000;
      transition: transform .3s ease-out;
      transform: scaleX(0);
    }

    &:hover {
      &::after {
        transform: scaleX(1);
      }
    }
  }

  & > ul {
      display: flex;
      flex-direction: row;
      list-style-type: none;
  }

  & > ul > li:not(:first-of-type) {
    margin-left: 24px;
  }
`

const contentStyle = css`
  grid-row: 2;
`
