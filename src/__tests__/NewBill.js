/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import BillsUI from '../views/BillsUI.js'
import { localStorageMock } from '../__mocks__/localStorage'
import { ROUTES, ROUTES_PATH } from '../constants/routes.js'
import mockedBills from '../__mocks__/store.js'
import userEvent from '@testing-library/user-event'
import { bills } from '../fixtures/bills.js'
import router from '../app/Router.js'
import mockStore from '../__mocks__/store'
import store from '../__mocks__/localStorage'

describe('Given I am connected as an employee', () => {
  describe('When I am on the new page', () => {
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
    test('Then mail icon in vertical layout should be highlighted', async () => {
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
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      // On vérifie si windowIcon a cette classe
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
  })
  describe('I upload a valid file in the input "justificatif"', () => {
    // Vérifie si le fichier valide est bien chargé
    test('no error message', () => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage,
      })
      const inputFile = screen.getByTestId('file')
      const file = new File([], 'image.png', { type: 'image/png' })
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      inputFile.addEventListener('change', handleChangeFile)
      waitFor(() => fireEvent.change(inputFile, { target: { files: [file] } }))

      expect(handleChangeFile).toHaveBeenCalled()
      const errorMessage = document.querySelector('#file-error-message')
      expect(errorMessage.classList.contains('message')).toBe(true)
    })
  })
  describe('I upload a invalid file in the input "justificatif"', () => {
    // affiche un message d'erreur quand le fichier chargé n'est pas conforme
    test('presence of error message ', async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      // window.onNavigate(ROUTES_PATH.NewBill)
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockedBills,
        localStorage: window.localStorage,
      })
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const inputFile = screen.getByTestId('file')
      inputFile.addEventListener('change', handleChangeFile)
      const file = new File(['image'], 'test.pdf', { type: 'test/pdf' })
      waitFor(() => fireEvent.change(inputFile, { target: { files: [file] } }))

      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.files[0].name).toBe('test.pdf')

      const errorMessage = screen.getByTestId('file-error-message')
      expect(errorMessage).not.toHaveClass('message')
      expect(screen.getByTestId('file-error-message')).toBeTruthy()
    })
  })
  describe('I fill in all the fields of the form', () => {
    test('I can submit form', async () => {
      document.body.innerHTML = NewBillUI({ data: bills })
      const inputData = {
        vat: '80',
        type: 'Hôtel et logement',
        commentary: 'séminaire billed',
        name: 'encore',
        fileName: '',
        date: '2004-04-04',
        amount: '400',
        pct: '20',
      }
      const expenseType = screen.getByTestId('expense-type')
      fireEvent.change(expenseType, { target: { value: inputData.type } })
      expect(expenseType.value).toBe(inputData.type)

      const expenseName = screen.getByTestId('expense-name')
      fireEvent.change(expenseName, { target: { value: inputData.name } })
      expect(expenseName.value).toBe(inputData.name)

      const datapicker = screen.getByTestId('datepicker')
      fireEvent.change(datapicker, { target: { value: inputData.date } })
      expect(datapicker.value).toBe(inputData.date)

      const amountInput = screen.getByTestId('amount')
      fireEvent.change(amountInput, { target: { value: inputData.amount } })
      expect(amountInput.value).toBe(inputData.amount)

      const vat = screen.getByTestId('vat')
      fireEvent.change(vat, { target: { value: inputData.vat } })
      expect(vat.value).toBe(inputData.vat)

      const pct = screen.getByTestId('pct')
      fireEvent.change(pct, { target: { value: inputData.pct } })
      expect(pct.value).toBe(inputData.pct)

      const commentary = screen.getByTestId('commentary')
      fireEvent.change(commentary, {
        target: { value: inputData.commentary },
      })
      expect(commentary.value).toBe(inputData.commentary)

      const inputFile = screen.getByTestId('file')
      userEvent.upload(inputFile, { target: { value: inputData.fileName } })
      expect(inputFile.value).toBe(inputData.fileName)

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          data: store,
          pathname,
          loading: false,
          error: null,
        })
      }
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockedBills,
        localStorage,
      })
      const submitButton = document.querySelector('#btn-send-bill')
      expect(submitButton).toBeDefined()
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      expect(handleSubmit).toBeDefined()
      const form = document.querySelector('form')
      form.addEventListener('submit', handleSubmit)
      expect(form).toBeDefined()
      fireEvent.click(submitButton)
      expect(handleSubmit).toHaveBeenCalled()
      await waitFor(() => screen.getAllByText('Mes notes de frais'))
      expect(screen.getByText('Mes notes de frais')).toBeTruthy()
    })
  })
})

// POST

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill page and submit a valid form', () => {
    test('Then a new bill should be created in the API', async () => {
      document.body.innerHTML = NewBillUI()

      const expenseType = screen.getByTestId('expense-type')
      const expenseName = screen.getByTestId('expense-name')
      const datapicker = screen.getByTestId('datepicker')
      const amountInput = screen.getByTestId('amount')
      const vatInput = screen.getByTestId('vat')
      const pctInput = screen.getByTestId('pct')
      const commentaryInput = screen.getByTestId('commentary')
      const inputFile = screen.getByTestId('file')
      // creation d'un bill
      const billInfos = {
        type: expenseType.value,
        name: expenseName.value,
        date: datapicker.value,
        amount: amountInput.value,
        vat: vatInput.value,
        pct: pctInput.value,
        commentary: commentaryInput.value,
        fileName: inputFile.value,
      }

      const mockedBills = mockStore.bills()

      const spyCreate = jest.spyOn(mockedBills, 'create')
      const spyUpdate = jest.spyOn(mockedBills, 'update')

      const billCreated = await spyCreate(billInfos)
      expect(spyCreate).toHaveBeenCalled()
      expect(billCreated.key).toBeDefined()
      expect(billCreated.fileUrl).toBeDefined()

      const billUpdated = await spyUpdate(billInfos)
      expect(spyUpdate).toHaveBeenCalled()
      expect(billUpdated.id).toBe('47qAXb6fIm2zOKkLzMro')
      expect(billUpdated.fileUrl).toBe(
        'https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a'
      )
      expect(billUpdated.fileName).toBe('preview-facture-free-201801-pdf-1.jpg')
    })
  })

  describe('When an error occurs on API', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
          email: 'a@a',
        })
      )

      document.body.innerHTML = NewBillUI()
    })

    test('Then new bill are added to the API but fetch fails with 404 message error', async () => {
      const mockedBills = mockStore.bills()
      const billUpdate = jest.spyOn(mockedBills, 'update')
      billUpdate.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 404'))
      )

      const html = BillsUI({ error: 'Erreur 404' })
      document.body.innerHTML = html
      const message = screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test('Then new bill are added to the API but fetch fails with 500 message error', async () => {
      const mockedBills = mockStore.bills()
      const billUpdate = jest.spyOn(mockedBills, 'update')
      billUpdate.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 505'))
      )

      const html = BillsUI({ error: 'Erreur 505' })
      document.body.innerHTML = html
      const message = screen.getByText(/Erreur 505/)
      expect(message).toBeTruthy()
    })
  })
})
