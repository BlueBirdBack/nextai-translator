import path from 'node:path'
import { expect, test } from './fixtures'
import { selectExampleText } from './common'
import { containerID, popupCardInnerContainerId, popupThumbID } from '../src/browser-extension/content_script/consts'

test('popup max height should not exceed current viewport height', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 420 })
    await page.goto(`file:${path.join(__dirname, 'test.html')}`)
    await selectExampleText(page)

    const thumb = page.locator(`#${containerID} #${popupThumbID}`)
    await expect(thumb).toBeVisible()
    await thumb.click()

    const popup = page.locator(`#${popupCardInnerContainerId}`)
    await expect(popup).toBeVisible()

    await expect.poll(async () => popup.evaluate((el) => (el as HTMLElement).style.maxHeight)).not.toEqual('')

    const maxHeight = await popup.evaluate((el) => {
        const value = parseInt((el as HTMLElement).style.maxHeight, 10)
        return Number.isFinite(value) ? value : -1
    })

    const viewportHeight = page.viewportSize()?.height ?? 0

    expect(maxHeight).toBeGreaterThan(0)
    expect(maxHeight).toBeLessThanOrEqual(viewportHeight)
})
