import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import Page from '../app/page'

describe('Page', () => {
    it('renders the logo', () => {
        render(<Page />)

        const page = screen.getByRole('img')

        expect(page).toBeInTheDocument()
    })
})
