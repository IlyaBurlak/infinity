import { test, expect } from '@playwright/test';

test.describe('Тестирование', () => {
    test.beforeEach(async ({ page }) => {
        const loadStart = Date.now();

        await page.goto('http://localhost:3000', {
            waitUntil: 'networkidle',
            timeout: 120000
        });

        await expect(async () => {
            const count = await page.locator('.user-card').count();
            expect(count).toBeGreaterThan(5);
        }).toPass({ timeout: 30000 });

        console.log(`[Метрика] Загрузка: ${Date.now() - loadStart} мс`);
    });

    test('Отображение списка и выбор элемента', async ({ page }) => {
        const cards = page.locator('.user-card');
        await expect(cards).not.toHaveCount(0);

        await expect(async () => {
            const clickStart = Date.now();
            await cards.first().click();
            console.log(`[Метрика] Клик: ${Date.now() - clickStart} мс`);
            await expect(page.locator('.editor-panel')).toBeVisible();
        }).toPass({ timeout: 15000 });
    });

    test('Проверка скроллинга', async ({ page }) => {
        const scrollStart = Date.now();
        await page.mouse.wheel(0, 5000);
        console.log(`[Метрика] Время прокрутки: ${Date.now() - scrollStart} мс`);

        const fpsMetrics = await page.evaluate(async () => {
            return new Promise(resolve => {
                let frames = 0;
                const start = performance.now();

                const tick = () => {
                    frames++;
                    performance.now() - start >= 1000
                        ? resolve(frames)
                        : requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
        });

        console.log(`[Метрика] FPS при скролле: ${fpsMetrics}`);
    });

    test('Обновление данных', async ({ page }) => {
        await page.locator('.user-card').first().click();

        await page.fill('input[name="firstName"]', 'TestUser');
        await page.fill('input[name="lastName"]', 'TestLastName');

        await expect(async () => {
            await page.click('button:has-text("Save Changes")');
            await expect(page.locator('.save-notification')).toBeVisible();
        }).toPass({ timeout: 10000 });
    });

    test('Замер ключевых метрик', async ({ page }) => {
        const domNodes = await page.evaluate(() => document.getElementsByTagName('*').length);

        const fpsMetrics = await page.evaluate(async () => {
            return new Promise(resolve => {
                let frames = 0;
                const start = performance.now();

                const tick = () => {
                    frames++;
                    performance.now() - start >= 1000
                        ? resolve(frames)
                        : requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
        });

        console.table({
            'DOM элементы': domNodes,
            'Частота кадров (FPS)': fpsMetrics
        });
    });
});