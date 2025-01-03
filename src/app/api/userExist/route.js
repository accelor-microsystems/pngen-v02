import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username').replace(/\s+/g, '')
    const password = searchParams.get('password').replace(/\s+/g, '')
    console.log(username, password)

    const user = await User.findOne({ username: username })
    console.log(user)


    if (user) {
        const match = await bcrypt.compare(password, user.password);
        console.log(match)
        if (match) {
            cookies().set('name', user.name, { secure: true })
            cookies().set('broadCategory', user.department, { secure: true })
            return NextResponse.json({ message: 200, user }, { status: 200 })
        }
        else
            return NextResponse.json({ message: 401 })
    }
    else {
        return NextResponse.json({ message: 404 })
    }



}
