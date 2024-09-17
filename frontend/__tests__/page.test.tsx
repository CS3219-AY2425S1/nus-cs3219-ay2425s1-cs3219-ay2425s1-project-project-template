import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
    it('renders the main element', () => {
        render(<Page />)

        const page = screen.getByRole('main')

        expect(page).toBeInTheDocument()
    })
})
