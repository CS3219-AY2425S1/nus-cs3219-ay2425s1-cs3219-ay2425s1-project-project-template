import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import Layout from '../components/layout/layout'

describe('Layout', () => {
    it('renders the logo', () => {
        render(<Layout children={undefined} />)

        const logo = screen.getByRole('img')
        expect(logo).toBeInTheDocument()
    })
})
