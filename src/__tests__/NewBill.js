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
  })
  describe('d', () => {
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

      fireEvent.change(inputFile, {
        target: {
          files: [file],
        },
      })

      expect(handleChangeFile).toHaveBeenCalled()
      // expect(inputFile.files[0]).toStrictEqual(file)
      //expect(inputFile.files[0].name).toBeDefined()
    })
  })
  describe('d', () => {
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
  })
  // affiche un message d'erreur quand le fichier chargé n'est pas conforme
  describe('r', () => {
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
//post
describe('When I am on NewBill page and submit a valid form', () => {
  describe('when i post a new bill', () => {
    test('Then it should create a new bill', async () => {
      const mockedBills = mockStore.bills()
      const infoCreate = {
        fileUrl: 'https://localhost:3456/images/test.jpg',
        key: '1234',
      }
      const billCreate = jest.spyOn(mockedBills, 'create')
      const billUpdate = jest.spyOn(mockedBills, 'update')
      const newBill = {
        id: '47qAXb6fIm2zOKkLzMro',
        vat: '80',
        fileUrl:
          'https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a',
        status: 'pending',
        type: 'Hôtel et logement',
        commentary: 'séminaire billed',
        name: 'fake new bill',
        fileName: 'preview-facture-free-201801-pdf-1.jpg',
        date: '2004-04-04',
        frenchDate: '04-04-2004',
        amount: 400,
        commentAdmin: 'ok',
        email: 'a@a',
        pct: 20,
      }
      const awaitBillCreate = await billCreate(infoCreate)
      expect(billCreate).toHaveBeenCalled()
      expect(awaitBillCreate.fileUrl).toBe(
        'https://localhost:3456/images/test.jpg'
      )
      expect(awaitBillCreate.key).toBe('1234')

      const awaitBillUpdate = await billUpdate(newBill)
      expect(billUpdate).toHaveBeenCalled()
      expect(awaitBillUpdate.id).toBe('47qAXb6fIm2zOKkLzMro')
      expect(awaitBillUpdate.fileUrl).toBe(
        'https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a'
      )
    })
    describe('When an error occurs on API', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock,
        })
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
        mockedBills.create().mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error('Erreur 404'))
            },
          }
        })
        window.onNavigate(ROUTES_PATH.NewBill)
        await new Promise(process.nextTick)
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test('Then new bill are added to the API but fetch fails with 500 message error', async () => {})
    })
  })
})
