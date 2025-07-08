import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CRow,
  CTooltip,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import LoadingButton from 'src/components/LoadingButton'

const LiveDemo = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Launch demo modal
      </LoadingButton>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>Woohoo, you&#39;re reading this text in a modal!</CModalBody>
        <CModalFooter>
          <LoadingButton onClick={() => setVisible(false)}>
            Close
          </LoadingButton>
          <LoadingButton>Save changes</LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const StaticBackdrop = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Launch static backdrop modal
      </LoadingButton>
      <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          I will not close if you click outside me. Don&#39;teven try to press escape key.
        </CModalBody>
        <CModalFooter>
          <LoadingButton onClick={() => setVisible(false)}>
            Close
          </LoadingButton>
          <LoadingButton>Save changes</LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const ScrollingLongContent = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Launch demo modal
      </LoadingButton>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
        </CModalBody>
        <CModalFooter>
          <LoadingButton onClick={() => setVisible(false)}>
            Close
          </LoadingButton>
          <LoadingButton>Save changes</LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const ScrollingLongContent2 = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Launch demo modal
      </LoadingButton>
      <CModal scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
        </CModalBody>
        <CModalFooter>
          <LoadingButton onClick={() => setVisible(false)}>
            Close
          </LoadingButton>
          <LoadingButton>Save changes</LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const VerticallyCentered = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Vertically centered modal
      </LoadingButton>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
          in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        </CModalBody>
        <CModalFooter>
          <LoadingButton onClick={() => setVisible(false)}>
            Close
          </LoadingButton>
          <LoadingButton>Save changes</LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const VerticallyCentered2 = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Vertically centered scrollable modal
      </LoadingButton>
      <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
          <p>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
            scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
            auctor fringilla.
          </p>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
            in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor.
          </p>
        </CModalBody>
        <CModalFooter>
          <LoadingButton onClick={() => setVisible(false)}>
            Close
          </LoadingButton>
          <LoadingButton>Save changes</LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const TooltipsPopovers = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Launch demo modal
      </LoadingButton>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>Popover in a modal</h5>
          <p>
            This
            <CPopover title="Popover title" content="Popover body content is set in this property.">
              <LoadingButton>button</LoadingButton>
            </CPopover>{' '}
            triggers a popover on click.
          </p>
          <hr />
          <h5>Tooltips in a modal</h5>
          <p>
            <CTooltip content="Tooltip">
              <CLink>This link</CLink>
            </CTooltip>{' '}
            and
            <CTooltip content="Tooltip">
              <CLink>that link</CLink>
            </CTooltip>{' '}
            have tooltips on hover.
          </p>
        </CModalBody>
        <CModalFooter>
          <LoadingButton onClick={() => setVisible(false)}>
            Close
          </LoadingButton>
          <LoadingButton>Save changes</LoadingButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

const OptionalSizes = () => {
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleLg, setVisibleLg] = useState(false)
  const [visibleSm, setVisibleSm] = useState(false)
  return (
    <>
      <LoadingButton onClick={() => setVisibleXL(!visibleXL)}>
        Extra large modal
      </LoadingButton>
      <LoadingButton onClick={() => setVisibleLg(!visibleLg)}>
        Large modal
      </LoadingButton>
      <LoadingButton onClick={() => setVisibleSm(!visibleSm)}>
        Small large modal
      </LoadingButton>
      <CModal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
        <CModalHeader>
          <CModalTitle>Extra large modal</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
      <CModal size="lg" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <CModalHeader>
          <CModalTitle>Large modal</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
      <CModal size="sm" visible={visibleSm} onClose={() => setVisibleSm(false)}>
        <CModalHeader>
          <CModalTitle>Small modal</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
    </>
  )
}

const FullscreenModal = () => {
  const [visible, setVisible] = useState(false)
  const [visibleSm, setVisibleSm] = useState(false)
  const [visibleMd, setVisibleMd] = useState(false)
  const [visibleLg, setVisibleLg] = useState(false)
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleXXL, setVisibleXXL] = useState(false)

  return (
    <>
      <LoadingButton onClick={() => setVisible(!visible)}>
        Full screen
      </LoadingButton>
      <LoadingButton onClick={() => setVisibleSm(!visibleSm)}>
        Full screen below sm
      </LoadingButton>
      <LoadingButton onClick={() => setVisibleMd(!visibleMd)}>
        Full screen below md
      </LoadingButton>
      <LoadingButton onClick={() => setVisibleLg(!visibleLg)}>
        Full screen below lg
      </LoadingButton>
      <LoadingButton onClick={() => setVisibleXL(!visibleXL)}>
        Full screen below xl
      </LoadingButton>
      <LoadingButton onClick={() => setVisibleXXL(!visibleXXL)}>
        Full screen below xxl
      </LoadingButton>
      <CModal fullscreen visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Full screen</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
      <CModal fullscreen="sm" visible={visibleSm} onClose={() => setVisibleSm(false)}>
        <CModalHeader>
          <CModalTitle>Full screen below sm</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
      <CModal fullscreen="md" visible={visibleMd} onClose={() => setVisibleMd(false)}>
        <CModalHeader>
          <CModalTitle>Full screen below md</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
      <CModal fullscreen="lg" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <CModalHeader>
          <CModalTitle>Full screen below lg</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
      <CModal fullscreen="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
        <CModalHeader>
          <CModalTitle>Full screen below xl</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
      <CModal fullscreen="xxl" visible={visibleXXL} onClose={() => setVisibleXXL(false)}>
        <CModalHeader>
          <CModalTitle>Full screen below xxl</CModalTitle>
        </CModalHeader>
        <CModalBody>...</CModalBody>
      </CModal>
    </>
  )
}

const Modals = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <DocsComponents href="components/modal/" />
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Below is a static modal example (meaning its <code>position</code> and{' '}
              <code>display</code> have been overridden). Included are the modal header, modal body
              (required for <code>padding</code>), and modal footer (optional). We ask that you
              include modal headers with dismiss actions whenever possible, or provide another
              explicit dismiss action.
            </p>
            <DocsExample href="components/modal">
              <CModal
                className="show d-block position-static"
                backdrop={false}
                keyboard={false}
                portal={false}
                visible
              >
                <CModalHeader>
                  <CModalTitle>Modal title</CModalTitle>
                </CModalHeader>
                <CModalBody>Modal body text goes here.</CModalBody>
                <CModalFooter>
                  <LoadingButton>Close</LoadingButton>
                  <LoadingButton>Save changes</LoadingButton>
                </CModalFooter>
              </CModal>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong> <small>Live demo</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Toggle a working modal demo by clicking the button below. It will slide down and fade
              in from the top of the page.
            </p>
            <DocsExample href="components/modal#live-demo">{LiveDemo()}</DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong> <small>Static backdrop</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              If you don't provide an <code>onDimsiss</code> handler to the Modal component, your
              modal will behave as though the backdrop is static, meaning it will not close when
              clicking outside it. Click the button below to try it.
            </p>
            <DocsExample href="components/modal#static-backdrop">{StaticBackdrop()}</DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong> <small>Scrolling long content</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              If you don't provide an <code>onDimsiss</code> handler to the Modal component, your
              modal will behave as though the backdrop is static, meaning it will not close when
              clicking outside it. Click the button below to try it.
            </p>
            <DocsExample href="components/modal#scrolling-long-content">
              {ScrollingLongContent()}
            </DocsExample>
            <p className="text-body-secondary small">
              You can also create a scrollable modal that allows scroll the modal body by adding{' '}
              <code>scrollable</code> prop.
            </p>
            <DocsExample href="components/modal#scrolling-long-content">
              {ScrollingLongContent2()}
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong> <small>Vertically centered</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Add <code>alignment='center'</code> to <code>&lt;CModal&gt;</code> to
              vertically center the modal.
            </p>
            <DocsExample href="components/modal#vertically-centered">
              {VerticallyCentered()}
            </DocsExample>
            <DocsExample href="components/modal#vertically-centered">
              {VerticallyCentered2()}
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong> <small>Tooltips and popovers</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              <code>&lt;CTooltips&gt;</code> and <code>&lt;CPopovers&gt;</code> can be placed within
              modals as needed. When modals are closed, any tooltips and popovers within are also
              automatically dismissed.
            </p>
            <DocsExample href="components/modal#tooltips-and-popovers">
              {TooltipsPopovers()}
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong> <small>Optional sizes</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Modals have three optional sizes, available via modifier classes to be placed on a{' '}
              <code>&lt;CModal&gt;</code>. These sizes kick in at certain breakpoints to avoid
              horizontal scrollbars on narrower viewports.
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Property size</th>
                  <th>Modal max-width</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Small</td>
                  <td>
                    <code>'sm'</code>
                  </td>
                  <td>
                    <code>300px</code>
                  </td>
                </tr>
                <tr>
                  <td>Default</td>
                  <td className="text-body-secondary">None</td>
                  <td>
                    <code>500px</code>
                  </td>
                </tr>
                <tr>
                  <td>Large</td>
                  <td>
                    <code>'lg'</code>
                  </td>
                  <td>
                    <code>800px</code>
                  </td>
                </tr>
                <tr>
                  <td>Extra large</td>
                  <td>
                    <code>'xl'</code>
                  </td>
                  <td>
                    <code>1140px</code>
                  </td>
                </tr>
              </tbody>
            </table>
            <DocsExample href="components/modal#optional-sizes">{OptionalSizes()}</DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Modal</strong> <small>Fullscreen Modal</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Another override is the option to pop up a modal that covers the user viewport,
              available via property <code>fullscrean</code>.
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Property fullscrean</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>true</code>
                  </td>
                  <td>Always</td>
                </tr>
                <tr>
                  <td>
                    <code>'sm'</code>
                  </td>
                  <td>
                    Below <code>576px</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>'md'</code>
                  </td>
                  <td>
                    Below <code>768px</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>'lg'</code>
                  </td>
                  <td>
                    Below <code>992px</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>'xl'</code>
                  </td>
                  <td>
                    Below <code>1200px</code>
                  </td>
                </tr>
                <tr>
                  <td>
                    <code>'xxl'</code>
                  </td>
                  <td>
                    Below <code>1400px</code>
                  </td>
                </tr>
              </tbody>
            </table>
            <DocsExample href="components/modal#fullscreen-modal">{FullscreenModal()}</DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Modals
