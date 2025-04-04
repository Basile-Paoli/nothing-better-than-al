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

    beforeAll(async () => {
        const res = await adminClient.post('account/ticket', testTicket);
        const res2 = await adminClient.post('account/ticket', testTicket2);
    });

    describe('GET /account', () => {
        it('should send user informations', async () => {
            const res = await axios.get("account");
    
            expect(res.data).toHaveProperty('user');
            expect(res.data.user).toMatchObject({
                id: expect.any(Number),
                email: expect.any(String),
                password: expect.any(String),
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
                const ticket = res.data.valid_ticket[0];
                expect(ticket).toMatchObject({
                    id: expect.any(Number),
                    max_usage: expect.any(Number),
                    used: expect.any(Number),
                    type: expect.any(String),
                    buy_date: expect.any(String),
                });
            }
        });
    });
    

    describe('GET /account/ticket', () => {
        it('should get my tickets', async () => {
            const res = await axios.get("account/ticket");

            expect(Array.isArray(res.data)).toBe(true);
            expect(res.data.length).toBe(2);
    
            const validTicket = res.data[0];
            expect(validTicket).toMatchObject({
                id: expect.any(Number),
                userId: expect.any(Number),
                max_usage: expect.any(Number),
                used: expect.any(Number),
                buy_date: expect.any(String),
                type: expect.any(String),
            });
            expect(validTicket.used).toBeLessThanOrEqual(validTicket.max_usage);

            const invalidTicket = res.data[1];
            expect(invalidTicket).toMatchObject({
                id: expect.any(Number),
                userId: expect.any(Number),
                max_usage: expect.any(Number),
                used: expect.any(Number),
                buy_date: expect.any(String),
                type: expect.any(String),
            });
            expect(invalidTicket.used).toBeGreaterThanOrEqual(invalidTicket.max_usage);
        });
    });
    

    describe('GET /account/ticket/valid', () => {
        it('should only get my valid tickets', async () => {
            const res = await axios.get("account/ticket/valid");
            expect(Array.isArray(res.data)).toBe(true);
    
            res.data.forEach((ticket: any) => {
                expect(ticket).toMatchObject({
                    id: expect.any(Number),
                    userId: expect.any(Number),
                    max_usage: expect.any(Number),
                    used: expect.any(Number),
                    buy_date: expect.any(String),
                    type: expect.any(String),
                });
                expect(ticket.used).toBeLessThanOrEqual(ticket.max_usage);
            });
        });
    });
    
    describe('GET /account/ticket/:id', () => {
        it('should get one ticket by the id (1)', async () => {
            const res = await axios.get("account/ticket/1");
            const ticket = res.data;
            expect(ticket).toMatchObject({
                id: 1,
                userId: expect.any(Number),
                max_usage: expect.any(Number),
                used: expect.any(Number),
                buy_date: expect.any(String),
                type: expect.any(String),
            });
        });
    });

    describe('GET /account/ticket/:id', () => {
        it('should return an error message if the ticket does not exist', async () => {
            try {
                const res = await axios.get("account/ticket/13");
            } catch (error) {
                expect(error.response).toBeDefined();
                expect(error.response.status).toBe(404);
                expect(error.response.data).toMatchObject({
                    message: "Le Ticket n'existe pas1",
                });
            }
        });
    });    
    

    describe('POST /account/ticket', () => {
        it('should create a new valid ticket', async () => {
            const body = {
                type: "normal",
                used: 0,
                max_usage: 10,
            };
    
            const res = await axios.post("account/ticket", body);
    
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
    

    describe('GET /account/ticket/:id', () => {
        it('should get the newly created ticket by ID', async () => {
            const res = await axios.get("account/ticket/3");
    
            expect(res.data).toMatchObject({
                id: 3,
                userId: expect.any(Number),
                max_usage: 10,
                used: 0,
                type: "normal",
                buy_date: expect.any(String),
            });
    
            const buyDate = new Date(res.data.buy_date);
            expect(buyDate).toBeInstanceOf(Date);
        });
    });


    describe('GET /account/balance', () => {
        it('should get the current balance of the user', async () => {
            const res = await axios.get("account/balance");
            expect(res.data.balance).toBe(0)
        });
    });


    describe('POST /account/balance', () => {
        it('should create a new valid ticket', async () => {
            const body = {
                balance: 10
            };
            const res = await axios.post("account/balance", body);
            expect(res.data).toBe(true)
        });
    });

    describe('GET /account/balance', () => {
        it('should get the current balance of the user', async () => {
            const res = await axios.get("account/balance");
            expect(res.data.balance).toBe(10)
        });
    });
    
})