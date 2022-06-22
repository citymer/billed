/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from '@testing-library/dom'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import { localStorageMock } from '../__mocks__/localStorage'
import router from '../app/Router'
import { ROUTES, ROUTES_PATH } from '../constants/routes.js'
import mockStore from '../__mocks__/store'
import userEvent from '@testing-library/user-event'

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then the newBill page should be rendered', () => {
      // Teste l'affichage du formulaire
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
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
    test('Then verify the file bill', async () => {
      jest.spyOn(mockStore, 'bills')

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      })
      Object.defineProperty(window, 'location', {
        value: { hash: ROUTES_PATH['NewBill'] },
      })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      )

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBillInit = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      })

      const file = new File(['image'], 'image.png', { type: 'image/png' })
      const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e))
      const formNewBill = screen.getByTestId('form-new-bill')
      const billFile = screen.getByTestId('file')

      billFile.addEventListener('change', handleChangeFile)
      userEvent.upload(billFile, file)
      expect(handleChangeFile).toHaveBeenCalled()
      expect(billFile.files[0]).toStrictEqual(file)
      expect(billFile.files[0].name).toBeDefined()
      expect(handleChangeFile).toBeCalled()
    })
  })
  describe('When I am on NewBill Page and I click on submit', () => {
    test('Then handlesubmit should be called', () => {
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      const handleSubmit = jest.fn(() => newBill.handleSubmit)
      const submitButton = screen.getByTestId('btn-send-bill')
      submitButton.addEventListener('click', handleSubmit)
      userEvent.click(submitButton)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
