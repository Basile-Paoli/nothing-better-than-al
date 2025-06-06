import axios from "axios";
import {adminClient, customerClient } from "./clients";

describe('Account API', () => {
    
    const testTicket = {
        type: "normal",
        used: 0,
        max_usage: 10,
    };
    const testTicket2 = {
        type: "normal",
        used: 10,
        max_usage: 10,
    };
    let ticket1Id
    let ticket2Id

    beforeAll(async () => {
        const res3 = await adminClient.patch("account/balance", {balance: 50});
        const res = await adminClient.post('account/tickets', testTicket);
        const res2 = await adminClient.post('account/tickets', testTicket2);
        ticket1Id = res.data.id
        ticket2Id = res2.data.id
    });

    describe('GET /account', () => {
        it('should send user informations', async () => {
            const res = await adminClient.get("account");
            expect(res.data).toHaveProperty('user');
            expect(res.data.user).toMatchObject({
                id: expect.any(Number),
                email: expect.any(String),
                role: expect.any(String),
                balance: expect.any(Number),
            });
    
            expect(res.data).toHaveProperty('movies');
            expect(Array.isArray(res.data.movies)).toBe(true);
    
            if (res.data.movies.length > 0) {
                const movie = res.data.movies[0];
                expect(movie).toHaveProperty("date");
                expect(movie).toHaveProperty("movies");
                expect(Array.isArray(movie.movies)).toBe(true);
    
                if (movie.movies.length > 0) {
                    const nestedMovie = movie.movies[0];
                    expect(nestedMovie).toMatchObject({
                        id: expect.any(Number),
                        name: expect.any(String),
                        duration: expect.any(Number),
                    });
                }
    
                expect(movie).toMatchObject({
                    used: expect.any(Number),
                    type: expect.any(String),
                    buy_date: expect.any(String),
                });
            }
    
            expect(res.data).toHaveProperty('valid_ticket');
            expect(Array.isArray(res.data.valid_ticket)).toBe(true);
    
            if (res.data.valid_ticket.length > 0) {
                res.data.valid_ticket.forEach((ti) => {
                    expect(ti).toMatchObject({
                        id: expect.any(Number),
                        max_usage: expect.any(Number),
                        used: expect.any(Number),
                        type: expect.any(String),
                        buy_date: expect.any(String),
                    });
                })
            }
        });
    });
    

    describe('GET /account/tickets', () => {
        it('should get my tickets', async () => {
            const res = await adminClient.get("account/tickets");

            expect(res.data.length).toBeGreaterThan(0);
            res.data.forEach((tic) => {
                if(tic.id == ticket1Id){
                    expect(tic).toMatchObject({
                        id: expect.any(Number),
                        userId: expect.any(Number),
                        max_usage: expect.any(Number),
                        used: expect.any(Number),
                        buy_date: expect.any(String),
                        type: expect.any(String),
                    });
                    expect(tic.used).toBeLessThanOrEqual(tic.max_usage);
                }
            })

            res.data.forEach((tic) => {
                if(tic.id == ticket2Id){
                    expect(tic).toMatchObject({
                        id: expect.any(Number),
                        userId: expect.any(Number),
                        max_usage: expect.any(Number),
                        used: expect.any(Number),
                        buy_date: expect.any(String),
                        type: expect.any(String),
                    });
                    expect(tic.used).toEqual(tic.max_usage);
                }
            })
        });
    });
    

    describe('GET /account/tickets/valid', () => {
        it('should only get my valid tickets', async () => {
            const res = await adminClient.get("account/tickets/valid");
            expect(Array.isArray(res.data)).toBe(true);
    
            res.data.forEach((ticket: any) => {
                expect(ticket).toMatchObject({
                    id: expect.any(Number),
                    max_usage: expect.any(Number),
                    used: expect.any(Number),
                    type: expect.any(String),
                    buy_date: expect.any(String),
                });
                expect(ticket.used).toBeLessThanOrEqual(ticket.max_usage);
            });
        });
    });
    
    describe('GET /account/tickets/:id', () => {
        it('should get one ticket by the id (1)', async () => {
            const res = await adminClient.get("account/tickets/1");
            const ticket = res.data;
            expect(ticket).toMatchObject({
                id: 1,
                max_usage: expect.any(Number),
                used: expect.any(Number),
                buy_date: expect.any(String),
                type: expect.any(String),
            });
        });
    });

    describe('GET /account/tickets/:id', () => {
        it('should return an error message if the ticket does not exist (13)', async () => {
            try {
                const res = await adminClient.get("account/tickets/13");
            } catch (error: any) {
                expect(error.response).toBeDefined();
                expect(error.response.status).toBe(404);
                expect(error.response.data).toMatchObject({
                    message: "Le Ticket n'existe pas",
                });
            }
        });
    });    
    

    describe('POST /account/tickets', () => {
        it('should create a new valid ticket', async () => {
            const body = {
                type: "normal",
                used: 0,
                max_usage: 10,
            };
    
            const res = await adminClient.post("account/tickets", body);
    
            expect(res.data).toMatchObject({
                id: expect.any(Number),
                userId: expect.any(Number),
                max_usage: body.max_usage,
                used: body.used,
                type: body.type,
                buy_date: expect.any(String),
            });
    
            const buyDate = new Date(res.data.buy_date);
            expect(buyDate).toBeInstanceOf(Date);
        });
    });


    describe('GET /account/balance', () => {
        it('should get the current balance of the user', async () => {
            const res = await adminClient.get("account/balance");
            expect(res.data).toBeGreaterThanOrEqual(30)
        });
    });


    describe('PATCH /account/balance', () => {
        it('should update the balance of the user', async () => {
            const body = {
                balance: 10
            };
            const res = await adminClient.patch("account/balance", body);
            expect(res.data).toBe(true)
        });
    });

    describe('GET /account/balance', () => {
        it('should get the current balance of the user', async () => {
            const res = await adminClient.get("account/balance");
            expect(res.data).toBeGreaterThanOrEqual(40)
        });
    });
    
})