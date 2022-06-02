/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from '@testing-library/dom'
import BillsUI from '../views/BillsUI.js'
import { bills } from '../fixtures/bills.js'
import { ROUTES_PATH} from '../constants/routes.js'
import {localStorageMock} from '../__mocks__/localStorage.js'
import Bills from '../containers/Bills.js'
import userEvent from '@testing-library/user-event'

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //on verifie si windowIcon a cette classe
      expect(windowIcon.classList.contains("active-icon")).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
   // Vérifie si la modale du justificatif apparait
   describe('When I click on the eye of a bill', () => {
    test('Then a modal must appear', async () => {
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
      const billsInit = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })
      document.body.innerHTML = BillsUI({ data: bills })
      const handleClickIconEye = jest.fn((icon) =>
        billsInit.handleClickIconEye(icon)
      )
      const iconEye = screen.getAllByTestId('icon-eye')
      const modaleFile = document.getElementById('modaleFile')
      $.fn.modal = jest.fn(() => modaleFile.classList.add('show'))
      iconEye.forEach((icon) => {
        icon.addEventListener('click', handleClickIconEye(icon))
        userEvent.click(icon)
        expect(handleClickIconEye).toHaveBeenCalled()
      })
      expect(modaleFile.classList.contains('show')).toBe(true)
    })
  })
})
