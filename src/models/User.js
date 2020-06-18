import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email address'});
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
});

userSchema.pre('save', async function(next) {
    try {
        const user = this;
        if (user.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.generateAuthToken = async function() {
    try {
        // Generate an auth token for the user
        const user = this;
        const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
        user.tokens = user.tokens.concat({token});
        await user.save();
        return token;
    } catch (err) {
        throw new Error(err);
    }
};

userSchema.statics.findByCredentials = async (email, password) => {
    try {
        // Search for a user by email and password.
        const user = await User.findOne({email} );
        if (!user) {
            throw new Error('invalid email or password');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('invalid email or password');
        }
        return user;
    } catch (err) {
        throw new Error(err);
    }
};

const User = mongoose.model('User', userSchema);

export default User;
