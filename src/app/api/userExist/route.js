import { NextResponse } from "next/server";
import connectMongoDB from "../../../lib/mongodb";
import User from "../../../models/user";
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

export async function GET(req) {
    connectMongoDB();
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')
    const password = searchParams.get('password')

    const res = await User.findOne({ username: username })
    console.log(res)


    if (res) {
        const match = await bcrypt.compare(password, res.password);
        if (match) {
            cookies().set('name', res.name, { secure: true })
            return NextResponse.json({ message: 200 }, { status: 200 })
        }
        else
            return NextResponse.json({ message: 401 })
    }
    else {
        return NextResponse.json({ message: 404 })
    }



}