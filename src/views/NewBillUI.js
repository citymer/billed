import VerticalLayout from './VerticalLayout.js'

export default () => {
  // ajout d'attribut dans l'input à la ligne 58 pour empêcher la saisie d'un document avec une extension différente de jpg,jpeg ou png
  // ecriture d'un ID pour l'input ou select conforme a son label
  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="expense-type" class="bold-label">Type de dépense</label>
                      <select id="expense-type" required class="form-control blue-border" data-testid="expense-type">
                        <option>Transports</option>
                        <option>Restaurants et bars</option>
                        <option>Hôtel et logement</option>
                        <option>Services en ligne</option>
                        <option>IT et électronique</option>
                        <option>Equipement et matériel</option>
                        <option>Fournitures de bureau</option>
                      </select>
                  </div>
                  <div class="col-half">
                    <label for="expense-name" class="bold-label">Nom de la dépense</label>
                    <input id="expense-name" type="text" class="form-control blue-border" data-testid="expense-name" placeholder="Vol Paris Londres" />
                  </div>
                  <div class="col-half">
                    <label for="datepicker" class="bold-label">Date</label>
                    <input id="datepicker" required type="date" class="form-control blue-border" data-testid="datepicker" />
                  </div>
                  <div class="col-half">
                    <label for="amount" class="bold-label">Montant TTC </label>
                    <input id="amount" required type="number" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col"> 
                      <label for="vat" class="bold-label">TVA</label>
                      <input id="vat" type="number" class="form-control blue-border" data-testid="vat" placeholder="70" />
                    </div>
                    <div class="flex-col">
                      <label for="pct" class="white-text">%</label>
                      <input id="pct" required type="number" class="form-control blue-border" data-testid="pct" placeholder="20" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="commentary" class="bold-label">Commentaire</label>
                    <textarea id="commentary" class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half">
                    <label for="file" class="bold-label">Justificatif</label>
                    <input id="file" required type="file" accept="image/png, image/jpeg, image/jpg" class="form-control blue-border" data-testid="file" />
                    <p class="error-message message" data-testid="file-error-message">
                    Le justificatif que vous fournissez doit être dans l'un de ses formats : png, jpeg ou jpg
                    </p>
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' data-testid="btn-send-bill" class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
}
