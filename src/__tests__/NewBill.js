/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import { localStorageMock } from '../__mocks__/localStorage'
import { ROUTES, ROUTES_PATH } from '../constants/routes.js'
import mockedBills from '../__mocks__/store.js'
import userEvent from '@testing-library/user-event'
import mockStore from '../__mocks__/store'
import { bills } from '../fixtures/bills.js'
import router from '../app/Router.js'

describe('Given I am connected as an employee', () => {
  // Vérifie si la page New est affiché
  test('Then the newBill page should be rendered', () => {
    const html = NewBillUI()
    document.body.innerHTML = html
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        type: 'Employee',
      })
    )
    const root = document.createElement('div')
    root.setAttribute('id', 'root')
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.NewBill)
    expect(screen.getAllByTestId('layout')).toBeTruthy()
    expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
  })
  describe('When I am on the new page', () => {
    // Vérifie si le fichier est bien chargé
    test('I upload a jpg file in the input "justificatif"', () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      })
      const inputFile = screen.getByTestId('file')
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      inputFile.addEventListener('change', handleChangeFile)
      const file = new File(['image'], 'image.jpg', { type: 'image/jpg' })

      userEvent.upload(inputFile, file)

      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.files[0]).toStrictEqual(file)
      expect(inputFile.files[0].name).toBeDefined()
    })
    test('I upload a invalid file in the input "justificatif" ', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      )
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage,
      })
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      const inputFile = screen.getByLabelText('Justificatif')
      inputFile.addEventListener('change', handleChangeFile)

      const file = new File(['image'], 'test.pdf', { type: 'test/pdf' })
      userEvent.upload(inputFile, file)
      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.files[0].name).toBe('test.pdf')
      const errorMessage = screen.getByTestId('file-error-message')
      expect(errorMessage).not.toHaveClass('message')
      expect(screen.getByTestId('file-error-message')).toBeTruthy()
    })

    test('I can submit form', async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      )

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })
      document.body.innerHTML = NewBillUI({ data: bills })
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

      const formNewBill = screen.getByTestId('form-new-bill')
      formNewBill.addEventListener('submit', handleSubmit)

      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
      await waitFor(() => screen.getAllByText('Mes notes de frais'))
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()
    })
  })
})
